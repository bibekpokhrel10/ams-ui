import React from "react";
import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
//
import MovieCard from "./MovieCard";
import { findByTestAtrr } from "../../utils/findTestAtrr";

configure({ adapter: new Adapter() });

const setUp = (props = {}) => {
  const component = shallow(<MovieCard {...props} />);
  return component;
};

describe("Card component", () => {
  let component;
  beforeEach(() => {
    component = setUp();
  });

  it("should render without error", () => {
    const wrapper = findByTestAtrr(component, "movieCard");
    expect(wrapper.length).toBe(1);
  });

  it("should render movie media", () => {
    const wrapper = findByTestAtrr(component, "movieMedia");
    expect(wrapper.length).toBe(1);
  });
});
